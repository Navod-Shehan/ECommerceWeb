import {Button, Card, Col, Image, Row} from "react-bootstrap";
import coconutImg from "../../../assets/images/product_coconut.webp";
import React, {FC} from "react";
import {useDispatch} from "react-redux";
import {ProductActionCreator} from "../../../state";
import {bindActionCreators} from "redux";
import Scroll from "react-scroll";
import {toast} from "react-hot-toast";
import {confirmAlert} from "react-confirm-alert";
import {IoCheckmark, IoClose} from "react-icons/all";
import {useMutation} from "@apollo/client";
import {DELETE_PRODUCT} from "../../../data/mutations";
import {GET_ALL_PRODUCTS} from "../../../data/queries";
import environment from "./environment.json";
import ReactS3Client from "react-aws-s3-typescript";

type ProductCardProps = {
  onClickEdit: (id: number) => void,
  id: number,
  productID: string,
  name: string,
  imgSrc: string,
  crossedPrice: number,
  sellPrice: number,
  category: string
};

const ProductCard: FC<ProductCardProps> = (props) => {
  const {onClickEdit, id, productID, name, imgSrc, crossedPrice, sellPrice, category} = props;

  const [deleteProduct, { data, loading, error }] = useMutation(DELETE_PRODUCT, {
    refetchQueries: [
      { query: GET_ALL_PRODUCTS }
    ],
  });
  if (loading) console.log('Loading...');
  if (error) console.log(error);
  if (!data) console.log('No data!');

  // const dispatch = useDispatch();
  // const {RemoveItem} = bindActionCreators(ProductActionCreator, dispatch);

  const deleteProductFromS3 = async () => {
    const bucketName: string = environment["REACT_APP_BUCKET_NAME"];
    const bucketRegion: string = environment["REACT_APP_BUCKET_REGION"];
    const accessKey: string = environment["REACT_APP_S3_KEY"];
    const secretKey: string = environment["REACT_APP_S3_SECRET"];

    const config = {
      bucketName: bucketName,
      region: bucketRegion,
      accessKeyId: accessKey,
      secretAccessKey: secretKey,
    }
    const s3 = new ReactS3Client(config);

    try {
      await s3.deleteFile(imgSrc);
      console.log('File deleted');
    } catch (exception) {
      console.log(exception);
    }

  }

  const handleOnClickDelete = () => {
    confirmAlert({
      customUI: ({onClose}) => {
        return (
          <div className="delete-confirm-alert">
            <h2 className="mt-1 mb-2">Confirm action</h2>
            <hr/>

            <div className="delete-confirm-text my-4 pt-1">
              <span>Delete product <b>{name}</b> ?</span>
            </div>

            <Button className="m-2 btn-outline-danger" onClick={ () => {
              deleteProduct({
                variables: {
                  deleteProductId: productID
                },
              });
              deleteProductFromS3();
              onClose();
              toast.success((t) => (
                  <span>Product <b>{name}</b> deleted</span>
              ));
            }
            }>
              <IoCheckmark/> Okay
            </Button>

            <Button className="m-2 btn-outline-success" onClick={() => {
              onClose();
            }}>
              <IoClose/> Cancel
            </Button>
          </div>
        );
      }
    });
  }

  const handleOnClickEdit = (id: number) => {
    onClickEdit(id);
    Scroll.scroller.scrollTo("edit-form", {
      smooth: false,
      offset: -150,
    });
  }

  return (
    <Col lg={3} md={4} sm={6} xs={6}  className="px-0 mx-0">
      <Card className="item-card text-center m-2 px-0">
        <Row className="text-center py-0">
          <Col className="p-0">
            <Image className="text-center" width="50%" height="auto" src={imgSrc}/>
          </Col>
        </Row>
        <Card.Body className="pt-0 pb-1">
          <Col className="card-title">
            <Card.Title className="px-3">{name}</Card.Title>
          </Col>
          <Row>
            <Col className="card-price px-0 pt-1 pb-0">
              <Row>
                <Col>
                  <h5 className="crossed-val">Rs.{crossedPrice}</h5>
                </Col>
                <Col>
                  <h5 className="item-val"> Rs.{sellPrice}</h5>
                </Col>
              </Row>
            </Col>
          </Row>
          <Row className="mx-0">
            <Col className="px-0">
              <Row className="mx-0 py-1">
                <Col className="px-0 text-xl-start" xl={6} xs={12}>
                  <Button
                    className="card-btn edit-btn"
                    variant="outline-secondary"
                    size="sm"
                    onClick={() => handleOnClickEdit(id)}
                  >
                    Edit
                  </Button>
                </Col>
                <Col className="px-0 text-xl-end pt-xl-0 pt-1" xl={6} xs={12}>
                  <Button
                    className="card-btn"
                    variant="outline-danger"
                    size="sm"
                    onClick={() => handleOnClickDelete()}
                  >
                    Delete
                  </Button>
                </Col>
              </Row>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Col>
  );
}

export default ProductCard;
